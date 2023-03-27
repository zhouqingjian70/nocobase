import { getDefaultFormat, str2moment, toGmt, toLocal } from '@nocobase/utils/client';
import moment from 'moment';

const toStringByPicker = (value, picker, timezone: 'gmt' | 'local') => {
  if (!moment.isMoment(value)) return value;
  if (timezone === 'local') {
    const offset = new Date().getTimezoneOffset();
    return moment(toStringByPicker(value, picker, 'gmt')).add(offset, 'minutes').toISOString();
  }

  if (picker === 'year') {
    return value.format('YYYY') + '-01-01T00:00:00.000Z';
  }
  if (picker === 'month') {
    return value.format('YYYY-MM') + '-01T00:00:00.000Z';
  }
  if (picker === 'quarter') {
    return value.startOf('quarter').format('YYYY-MM') + '-01T00:00:00.000Z';
  }
  if (picker === 'week') {
    return value.startOf('week').add(1, 'day').format('YYYY-MM-DD') + 'T00:00:00.000Z';
  }
  return value.format('YYYY-MM-DD') + 'T00:00:00.000Z';
};

const toGmtByPicker = (value: moment.Moment | moment.Moment[], picker?: any) => {
  if (!value) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((val) => toStringByPicker(val, picker, 'gmt'));
  }
  if (moment.isMoment(value)) {
    return toStringByPicker(value, picker, 'gmt');
  }
};

const toLocalByPicker = (value: moment.Moment | moment.Moment[], picker?: any) => {
  if (!value) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((val) => toStringByPicker(val, picker, 'local'));
  }
  if (moment.isMoment(value)) {
    return toStringByPicker(value, picker, 'local');
  }
};

export interface Moment2strOptions {
  showTime?: boolean;
  gmt?: boolean;
  utc?: boolean;
  picker?: 'year' | 'month' | 'week' | 'quarter';
}

export const moment2str = (value?: moment.Moment | moment.Moment[], options: Moment2strOptions = {}) => {
  const { showTime, gmt, picker, utc = true } = options;
  if (!value) {
    return value;
  }
  if (!utc) {
    const format = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
    return Array.isArray(value) ? value.map((val) => val.format(format)) : value.format(format);
  }
  if (showTime) {
    return gmt ? toGmt(value) : toLocal(value);
  }
  if (typeof gmt === 'boolean') {
    return gmt ? toGmtByPicker(value, picker) : toLocalByPicker(value, picker);
  }
  return toGmtByPicker(value, picker);
};

export const mapDateFormat = function () {
  return (props: any) => {
    const format = getDefaultFormat(props) as any;
    const onChange = props.onChange;

    return {
      ...props,
      format: format,
      value: str2moment(props.value, props),
      onChange: (value: moment.Moment | moment.Moment[]) => {
        if (onChange) {
          onChange(moment2str(value, props));
        }
      },
    };
  };
};
