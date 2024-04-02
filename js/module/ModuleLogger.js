class ClassLogger {
    constructor() {
        // this._I = 1;
    }
    get LogLevel() {
        return ({
            INFO: 'INFO',
            DEBUG: 'DEBUG',
            ERROR: 'ERROR',
            WARN: 'WARN'
        });
    }
    Log(qlfier, msg) {
        if (this.LogLevel[qlfier]) {
            // TODO: get time from Process
            console.log(`[${Process.GetSystemTime()}] ${qlfier}>> ${msg}`);
            return true;
        }
        return false;
    }
}
exports = ClassLogger;