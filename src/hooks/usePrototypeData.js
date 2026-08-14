import { useEffect,useState } from 'react';
import { prototypeStorage } from '../utils/prototypeStorage';

export default function usePrototypeData(){
  const [data,setData]=useState(prototypeStorage.get);
  useEffect(()=>{const refresh=()=>setData(prototypeStorage.get());addEventListener('prototype-data-change',refresh);addEventListener('storage',refresh);return()=>{removeEventListener('prototype-data-change',refresh);removeEventListener('storage',refresh)}},[]);
  return data;
}
