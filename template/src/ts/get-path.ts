import { join } from 'path'
export default (...paths: string[]) => join(__dirname, '..', ...paths)
