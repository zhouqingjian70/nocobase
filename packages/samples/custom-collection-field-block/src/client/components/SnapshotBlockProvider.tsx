
import {
  CollectionManagerProvider,
  CollectionProvider
} from '@nocobase/client';
import React, { useContext } from 'react';
import collections from './collections';
import { SnapshotContext } from './context';

export const SnapshotBlockProvider = (props) => {
  const { collectionField } = useContext(SnapshotContext);
  console.log('SnapshotBlockProvider', collectionField);
  return (
    <CollectionManagerProvider collections={collections}>
      <CollectionProvider name={'test1'}>{props.children}</CollectionProvider>
    </CollectionManagerProvider>
  );
};
