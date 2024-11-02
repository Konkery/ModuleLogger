/**
 * @class
 * @description Транспортный класс, предоставляющий функционал
 * записи сообщений в Graylog
 *  * Тип для передачи аргументов создания транспорта
 * @typedef  {Object} options    - тип аргумента, содержащий необходимые для передачи поля
 * @property {String} server     - IP-адрес сервера Graylog, необязательное поле (по-умолчанию localhost)
 * @property {Number} port       - порт сервера Graylog, необязательное поле (по-умолчанию 12201)
 * @property {String} source     - имя источника сообщений, необязательное поле (по-умолчанию plcDefault)
 * @property {String} facility   - идентификатор ПО/процесса, генерирующего сообщения, необязательное поле (по-умолчанию HorizonPLC)
 * @property {Number} bufferSize - максимальный размер сообщения с учём размера UDP пакета, необязательное поле (по-умолчанию 1350)
 */
class GrayLogTransport {
    /**
     * @constructor
     * @param {Object} options      - параметры сервера Graylog
     */
    constructor(options) {
        this.server = options.server || '127.0.0.1';
        this.port = options.port || 12201;
        this.source = options.hostname || 'plcDefault';
        this.facility = options.facility || 'HorizonPLC';
        this.bufferSize = options.bufferSize || 1350;
        this.socket = require('dgram').createSocket('udp4');    // UDP сокет для отправки сообщений
    }
    /**
     * @method
     * @description
     * Форматирует сообщение и отправляет его на сервер Graylog 
     * @param {String} _msg         - сообщение для логирования
     * @param {Number} level        - уровень логирования 
     */
    Log(_msg, level, level_desc, srvc, obj) {
        let msg = {
            version    : '1.1',
            host       : this.source,
            facility   : this.facility,
            level      : level,
            message    : _msg,
            level_desc : level_desc,
            service    : srvc,
            full_message   : obj,
            service_bus    : 'appBus'
        };
        let toSend = JSON.stringify(msg);
        Process._Wifi.UDPHost(this.server, this.port);
        this.socket.send(toSend, 0, toSend.length, this.port, this.server, (err, bytes) => {
            if (err || bytes > this.bufferSize) {
                console.log('Cannot send UDP socket');
            }
        });
    }
}

/**
 * @class
 * Класс предоставляет инструменты для логирования 
 */
class ClassLogger {
    /**
     * @constructor
     */
    constructor() {
        this._Enabled = true;
        this._Glog = new GrayLogTransport(Process._LogCreds);
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
            CRITICAL: 2,
            ERROR: 3,
            WARN: 4,
            NOTICE: 5,
            INFO: 6,
            DEBUG: 7,
        });
    }
    /**
     * @method
     * @description
     * Выводит сообщение в консоль и подготавлиеввает его к отправке в Graylog
     * @param {Number} qlfier           - уровень логирования 
     * @param {String} msg              - сообщение лога 
     * @returns 
     */
    Log(service, qlfier, msg, obj) {
        if (!this._Enabled) return;
        const logdesc = ['CRITICAL', 'ERROR', 'WARN', 'NOTICE', 'INFO', 'DEBUG'];

        if (Process._HaveWiFi == true) {
            this._Glog.Log(msg, qlfier, logdesc[qlfier-2], service, obj);
        }
        
        console.log(`[${Process.GetSystemTime()}] ${service} | ${logdesc[qlfier-2]} | ${msg}`);
    }
}
exports = ClassLogger;