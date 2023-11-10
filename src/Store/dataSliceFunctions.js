import { useSelector, useDispatch } from 'react-redux'
export function getAllDevices(obj){
    return _getAllDevices({...obj});
  }
  function _getAllDevices(x, devices = [],path="") {
    obj={...x};
    if (obj.type == "container") {
        path+=obj.separator+obj.path;
      obj.Data.forEach((element) => {
         _getAllDevices(element, devices,path)
      });
    } else {
        obj.path=path+obj.separator+obj.path
        devices.push(obj)
    }
    return devices;
  }

  export function setStateOfDevice(state,path,newState){
    const list=getAllDevices(state);
    list.forEach(element => {
        if(element.path==path){
            element.state=newState
        }
    });
    
  }
  export function getDeviceFromState(path){
    const reduxData = useSelector((state) => state.data)
    const list=getAllDevices(reduxData);
    list.forEach(element => {
        console.log(element.path)
        console.log(path)
        if(element.path==path){
            element;
        }
    });
  }