La API con soporte para HTTPS se encuentra en la rama "https", con la misma funcionalidad que la rama "master" siendo la adición de HTTPS el único cambio.

Es necesario generar dos archivos con el siguiente comando:

openssl req -nodes -new -x509 -keyout server.key -out server.cert

Después, hay que copiar los archivos resultantes ("server.key" y "server.cert") en la carpeta "keys" que está en la raíz del proyecto.
