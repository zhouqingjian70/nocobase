const postgres = {
  'character varying': 'string',
  varchar: 'string',
  text: 'text',
  char: 'string',

  smallint: 'integer',
  integer: 'integer',
  bigint: 'bigInt',
  decimal: 'float',
  numeric: 'float',
  'double precision': 'float',

  'timestamp without time zone': 'date',
  'timestamp with time zone': 'date',
  date: 'date',
  boolean: 'boolean',

  json: ['json', 'array'],
  jsonb: ['jsonb', 'array'],
};

const mysql = {
  varchar: 'string',
  text: 'text',
  int: 'integer',
  integer: 'integer',
  bigint: 'bigInt',
  float: 'float',
  double: 'double',
  boolean: 'boolean',

  tinyint: 'integer',
  datetime: 'date',
  timestamp: 'date',
  json: ['json', 'array'],
};

const sqlite = {
  text: 'text',
  varchar: 'string',

  integer: 'integer',
  real: 'real',
  float: 'float',
  double: 'double',

  datetime: 'date',
  date: 'date',
  time: 'time',

  boolean: 'boolean',

  numeric: 'decimal',
  json: ['json', 'array'],
};

export default { postgres, mysql, sqlite };
