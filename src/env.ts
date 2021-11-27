import "dotenv/config";

interface getEnvOptions {
    defaultValue?: string;
    throwIfNotExist?: boolean;
};

/**
 * Mendapatkan nilai variable dari nama.
 * @param VARIABLE_NAME Nama variable yang ingin anda dapatkan dienv variable
 * @param options Function options
 * @returns {string|undefined} Nilai variable atau undefined
 */
export function getEnv(VARIABLE_NAME: string, options?: getEnvOptions): string | undefined {
    const ENV = process.env;
    const name = VARIABLE_NAME.toString();
    let VARIABLE_VALUE = ENV[name];
    if (options?.defaultValue) VARIABLE_VALUE = options.defaultValue.toString();
    if (options?.throwIfNotExist && VARIABLE_VALUE == undefined) throw new Error(`${name} is not exist in env variable`);
    return VARIABLE_VALUE;
};