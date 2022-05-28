import { SubMenu } from './SubMenu';

export type Menu = {
  name: string,
  url: string, //agrege new
  iconClass: string,
  active: boolean,
  submenu: SubMenu[]
  // submenu: { name: string, url: string }[]
}
