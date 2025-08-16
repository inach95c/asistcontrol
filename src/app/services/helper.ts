/*let baserUrl = 'http://192.168.1.100:8080'    //en el ip va localhost si es local  ....'http://192.168.145.196:8080'
export default baserUrl;
*/


/*Nota*/ 
/*Es importante jugar con este archivo a la hora de desplegar el proyecto*/


 // para local ok  
/*
let baserUrl = '';

if (window.location.protocol === 'https:') {
  baserUrl = '/api';
} else {
  baserUrl = 'http://192.168.1.100:8080';
}

export default baserUrl;
*/




 // para produccion y esta ok

import { environment } from '../../environments/environment';

const baserUrl = environment.backendUrl;

export default baserUrl;


