export interface SlaveExecute {
    fn: string;
    args: any[];
}
export interface SlaveResponse {
    result: any;
    time: number;
    error?: any
};