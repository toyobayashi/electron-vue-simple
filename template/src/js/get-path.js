import { join } from 'path'
export default (...paths) => join(__dirname, '..', ...paths)
