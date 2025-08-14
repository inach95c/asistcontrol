/*let baserUrl = 'http://192.168.1.100:8080'    //en el ip va localhost si es local  ....'http://192.168.145.196:8080'
export default baserUrl;
*/


/*Nota*/ 
/*Es importante jugar con este archivo a la hora de desplegar el proyecto*/



/*

let baseUrl = '';

if (window.location.hostname === 'localhost') {
  // Entorno local
  baseUrl = 'http://localhost:8080';
  
} else {
  // Entorno de producción: reemplaza con tu URL real del backend
  baseUrl = 'https://tu-servidor-backend.com';
}

export default baseUrl;
*/

/* ok  */

let baserUrl = '';

if (window.location.protocol === 'https:') {
  baserUrl = '/api';
} else {
  baserUrl = 'http://192.168.1.100:8080';
}

export default baserUrl;




/*

let baserUrl = '';

if (window.location.protocol === 'https:') {
  baserUrl = ''; // 👉 solo raíz, sin /api
} else {
  baserUrl = 'http://192.168.1.100:8080';
}

export default baserUrl;
*/