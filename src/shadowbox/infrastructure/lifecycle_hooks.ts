const hooks = new Map();
import * as logging from './logging';

export class HooksManager {
  public logger: object;
  public key: string;
    constructor() {
      this.key = 'HooksManager';
      this.logger = {};
      ['info', 'warn', 'error', 'debug'].forEach(level => {
          this.logger[level] = (...args) => console[level]('[HooksHandler]', ...args);
      });
    }

    addHook(hook, handler) {
        hook = (hook || '')
            .toString()
            .replace(/\s+/g, '')
            .toLowerCase();
        if (!hook) {
            return;
        }
        if (!hooks.has(hook)) {
            hooks.set(hook, []);
        }
        hooks.get(hook).push({ manager: this, handler });
    }

    runHooks(hook, ...args) {
        let next = args.pop();
        hook = (hook || '')
            .toString()
            .replace(/\s+/g, '')
            .toLowerCase();
        if (!hook || !hooks.has(hook)) {
          if (next) setImmediate(next);
          return
        }
        let handlers = hooks.get(hook);
        let pos = 0;
        let processHandler = () => {
            if (pos >= handlers.length) {
              if(next) setImmediate(next);
              return
            }
            let entry = handlers[pos++];
            let returned = false;
            try {
                entry.handler(...args, err => {
                    if (returned) {
                        return;
                    }
                    returned = true;
                    if (err) {
                        entry.manager.logger.error('Failed processing hook %s. %s', hook, err.message);
                    }
                    setImmediate(processHandler);
                });
            }
            catch (err) {
                if (returned) {
                    return;
                }
                returned = true;
                entry.manager.logger.error('Failed processing hook %s. %s', hook, err.message);
                setImmediate(processHandler);
            }
        };
        setImmediate(processHandler);
    }
};

export const requestHookMiddleware = (eventName: string, hooksManager: HooksManager) => {
  return (req, res, next) => {
    hooksManager.runHooks(`pre${eventName}`, req, null);
    next();
    hooksManager.runHooks(`post${eventName}`, res, null);
  };
};
