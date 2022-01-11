interface PrintColumn {
  name: string;
  title: string;
  length: number;
}

import stringWidth from 'string-width';

const normalizeSpacing = (str: string, length: number) => {
  let normalStr;
  if (!str) {
    normalStr = '暂无';
  } else {
    normalStr = str.toString();
  }
  let strWidth = stringWidth(normalStr);
  if (strWidth < 5) {
    normalStr = normalStr + ' '.repeat(5 - strWidth);
  }
  strWidth = stringWidth(normalStr);
  if (strWidth < length) {
    const parsedString = normalStr + ' '.repeat(length - strWidth);
    return parsedString + '\t';
  }
  return normalStr;
};

const parsePrintString = (
  data: Array<any>,
  columns: Array<PrintColumn>,
  auxString?: string,
) => {
  const titleString = `\n ${columns
    .map(column => normalizeSpacing(column.title, column.length))
    .join(' | ')}`;
  let dataString = '';
  data.forEach(row => {
    dataString += `\n ${columns
      .map(column => normalizeSpacing(row[column.name], column.length))
      .join(' | ')}`;
  });
  const aux = auxString ? `\n ${auxString}` : '';
  return `${titleString}${dataString}${aux}`;
};

export { parsePrintString, PrintColumn };
