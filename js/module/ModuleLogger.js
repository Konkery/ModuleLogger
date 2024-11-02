/**
 * @class
 * Класс предоставляет инструменты для логирования 
 */
class ClassLogger {
    constructor() {
        this._Enabled = true;
    }
    /**
     * @setter
     * @param {Boolean} flag 
     */
    set Enabled(flag) {
        if (typeof flag === 'boolean') {
            this._Enabled = flag;
            return true;
        }
        return false;    
    }
    /**
     * @getter
     * Объект с уровнями логов 
     */
    get LogLevel() {
        return ({
            INFO: 'INFO',
            DEBUG: 'DEBUG',
            ERROR: 'ERROR',
            WARN: 'WARN'
        });
    }
    Log(qlfier, msg) {
        if (!this._Enabled) return;
        
        if (this.LogLevel[qlfier]) {
            console.log(`[${Process.GetSystemTime()}] ${qlfier}>> ${msg}`);
            return true;
        }
        return false;
    }
}
exports = ClassLogger;