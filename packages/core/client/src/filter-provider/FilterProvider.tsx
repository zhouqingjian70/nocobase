import { useField, useFieldSchema } from '@formily/react';
import React, { createContext, useEffect, useRef } from 'react';
import { useBlockRequestContext } from '../block-provider';
import { SharedFilter, mergeFilter } from '../block-provider/SharedFilterProvider';
import { CollectionFieldOptions, useCollection } from '../collection-manager';
import { removeNullCondition } from '../schema-component';
import { useAssociatedFields } from './utils';
import { uniqBy } from 'lodash';

type Collection = ReturnType<typeof useCollection>;

export interface DataBlock {
  /** 唯一标识符，schema 中的 name 值 */
  uid: string;
  /** 用户自行设置的区块名称 */
  title?: string;
  /** 与当前区块相关的数据表信息 */
  collection: Collection;
  /** 根据提供的参数执行该方法即可刷新数据区块的数据 */
  doFilter: (params: any, params2?: any) => Promise<void>;
  /** 清除筛选区块设置的筛选参数 */
  clearFilter: (uid: string) => void;
  /** 数据区块表中所有的关系字段 */
  associatedFields?: CollectionFieldOptions[];
  /** 通过右上角菜单设置的过滤条件 */
  defaultFilter?: SharedFilter;
  service?: any;
  /** 区块所对应的 DOM 容器 */
  dom: HTMLElement;
}

interface FilterContextValue {
  dataBlocks: DataBlock[];
  setDataBlocks: React.Dispatch<React.SetStateAction<DataBlock[]>>;
}

const FilterContext = createContext<FilterContextValue>(null);

/**
 * 主要用于记录当前页面中的数据区块的信息，用于在过滤区块中使用
 * @param props
 * @returns
 */
export const FilterBlockProvider: React.FC = ({ children }) => {
  const [dataBlocks, setDataBlocks] = React.useState<DataBlock[]>([]);
  return <FilterContext.Provider value={{ dataBlocks, setDataBlocks }}>{children}</FilterContext.Provider>;
};

export const FilterBlockRecord = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { filter: SharedFilter };
}) => {
  const collection = useCollection();
  const { recordDataBlocks, removeDataBlock } = useFilterBlock();
  const { service } = useBlockRequestContext();
  const field = useField();
  const fieldSchema = useFieldSchema();
  const associatedFields = useAssociatedFields();
  const container = useRef(null);

  const shouldApplyFilter =
    field.decoratorType !== 'FilterFormBlockProvider' &&
    field.decoratorType !== 'FormBlockProvider' &&
    field.decoratorProps.blockType !== 'filter';

  const addBlockToDataBlocks = () => {
    recordDataBlocks({
      uid: fieldSchema['x-uid'],
      title: field.componentProps.title,
      doFilter: service.runAsync,
      collection,
      associatedFields,
      defaultFilter: params?.filter || {},
      service,
      dom: container.current,
      clearFilter(uid: string) {
        const param = this.service.params?.[0] || {};
        const storedFilter = this.service.params?.[1]?.filters || {};
        delete storedFilter[uid];
        const mergedFilter = mergeFilter([
          ...Object.values(storedFilter).map((filter) => removeNullCondition(filter)),
          params?.filter || {},
        ]);

        this.service.run(
          {
            ...param,
            page: 1,
            filter: mergedFilter,
          },
          { filters: storedFilter },
        );
      },
    });
  };

  useEffect(() => {
    if (shouldApplyFilter) addBlockToDataBlocks();
  }, [params?.filter, service]);

  useEffect(() => {
    return () => {
      removeDataBlock(fieldSchema['x-uid']);
    };
  }, []);

  return <div ref={container}>{children}</div>;
};

/**
 * 返回一些方法用于收集和获取当前页面中的数据区块的信息
 * @returns
 */
export const useFilterBlock = () => {
  const ctx = React.useContext(FilterContext);
  // 有可能存在页面没有提供 FilterBlockProvider 的情况，比如内部使用的数据表管理页面
  if (!ctx) {
    return {
      recordDataBlocks: () => {},
      getDataBlocks: () => [] as DataBlock[],
      removeDataBlock: () => {},
    };
  }
  const { dataBlocks, setDataBlocks } = ctx;
  const recordDataBlocks = (block: DataBlock) => {
    const existingBlock = dataBlocks.find((item) => item.uid === block.uid);

    if (existingBlock) {
      // 这里的值有可能会变化，所以需要更新
      existingBlock.service = block.service;
      existingBlock.defaultFilter = block.defaultFilter;
      return;
    }
    // 由于 setDataBlocks 是异步操作，所以上面的 existingBlock 在判断时有可能用的是旧的 dataBlocks,所以下面还需要根据 uid 进行去重操作
    setDataBlocks((prev) => uniqBy([...prev, block], 'uid'));
  };
  const getDataBlocks = () => dataBlocks;
  const removeDataBlock = (uid: string) => {
    setDataBlocks((prev) => prev.filter((item) => item.uid !== uid));
  };

  return { recordDataBlocks, getDataBlocks, removeDataBlock };
};
