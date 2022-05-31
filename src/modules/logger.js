import tracer from 'tracer';

const logger = tracer.dailyfile({
    root: './logs',
    allLogsFileName: 'fpd_logs',
    format: '{{timestamp}} <{{title}}> ({{file}}:{{line}}) {{message}}',
    dateformat: 'yyyy-mm-dd HH:MM:ss',
});

export default logger;