import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { default as tz } from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
require('dayjs/locale/ru');

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);

const timezone = `Europe/Moscow`;
dayjs.tz.guess();
dayjs.tz.setDefault(timezone);
dayjs.locale('ru');

export { dayjs, timezone };
