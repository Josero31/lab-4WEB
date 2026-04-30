# lab-4WEB
Node API

---

# Solución — Parte 1: Depuración del Servidor Roto

Archivo original: `Laboratorio_4_servidor_malo.js`  
Archivo corregido: `servidor-corregido.js`

---

### Error #1: Content-Type con sintaxis incorrecta

**Ubicación:** Línea 15 del archivo original  
**Tipo de error:** HTTP  
**Qué estaba mal:** El valor del header `Content-Type` usaba un guion (`-`) en lugar de una barra diagonal (`/`), lo que produce un MIME type inválido que los clientes no pueden interpretar correctamente.  
**Cómo lo corregí:**

```js
// Antes
res.writeHead(200, { "Content-Type": "application-json" })

// Después
res.writeHead(200, { "Content-Type": "application/json" })
```

---

### Error #2: Falta `await` en operación asíncrona

**Ubicación:** Línea 22 del archivo original  
**Tipo de error:** Asincronía  
**Qué estaba mal:** `fs.readFile` devuelve una `Promise`. Sin `await`, la variable `texto` almacena el objeto Promise en lugar del contenido del archivo, por lo que la respuesta enviada al cliente es `{}` en vez de los datos reales.  
**Cómo lo corregí:**

```js
// Antes
const texto = fs.readFile(filePath, "utf-8")

// Después
const texto = await fs.readFile(filePath, "utf-8")
```

---

### Error #3: Double-encoding del JSON con `JSON.stringify`

**Ubicación:** Línea 24 del archivo original  
**Tipo de error:** Lógica  
**Qué estaba mal:** `fs.readFile` con encoding `"utf-8"` ya devuelve el contenido del archivo como string. Como `datos.json` es JSON válido, ese string ya puede enviarse directamente. Aplicar `JSON.stringify()` sobre un string lo convierte en una cadena entrecomillada y con caracteres escapados, produciendo JSON inválido en la respuesta.  
**Cómo lo corregí:**

```js
// Antes
res.end(JSON.stringify(texto))

// Después
res.end(texto)
```

---

### Error #4: Código de estado HTTP incorrecto para ruta no encontrada

**Ubicación:** Línea 28 del archivo original  
**Tipo de error:** HTTP  
**Qué estaba mal:** Se respondía con código `200 OK` cuando ninguna ruta coincidía, lo cual es semánticamente incorrecto. El estándar HTTP define `404 Not Found` para indicar que el recurso solicitado no existe.  
**Cómo lo corregí:**

```js
// Antes
res.writeHead(200, { "Content-Type": "text/plain" })

// Después
res.writeHead(404, { "Content-Type": "text/plain" })
```

---

### Error #5: Paréntesis de cierre faltante en `http.createServer`

**Ubicación:** Línea 30 del archivo original  
**Tipo de error:** Sintaxis  
**Qué estaba mal:** La llamada a `http.createServer(async (req, res) => { ... }` nunca se cerraba con el paréntesis de la función `createServer`. Solo se cerraba la llave `}` de la función callback, pero faltaba el `)` que cierra la llamada exterior.  
**Cómo lo corregí:**

```js
// Antes
}

// Después
})
```

---

### Error #6: Paréntesis de cierre faltante en `server.listen`

**Ubicación:** Línea 34 del archivo original  
**Tipo de error:** Sintaxis  
**Qué estaba mal:** Igual que el error anterior, `server.listen(PORT, () => { ... }` cerraba la llave `}` del callback pero omitía el `)` de cierre de `listen(`. Esto genera un `SyntaxError` al ejecutar el archivo.  
**Cómo lo corregí:**

```js
// Antes
}

// Después
})
```
