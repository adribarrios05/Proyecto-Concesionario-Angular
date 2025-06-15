import pandas as pd
import json
import os

# Crear la carpeta resultados si no existe
os.makedirs('resultados', exist_ok=True)

# Cargar el archivo JSON
with open('datos_completos.json', encoding='utf-8') as file:
    data = json.load(file)

# Crear DataFrames
df_customers = pd.DataFrame(data['customers'])
df_cars = pd.DataFrame(data['cars'])

# Limpieza básica
df_customers = df_customers.applymap(lambda x: x.strip() if isinstance(x, str) else x)
df_cars = df_cars.applymap(lambda x: x.strip() if isinstance(x, str) else x)

# Rellenar nulos
df_customers.fillna('Desconocido', inplace=True)
df_cars.fillna('Sin dato', inplace=True)

# Diccionario para convertir número a palabra (puedes ampliarlo si hay más casos)
numero_a_texto = {
    1: 'una',
    2: 'dos',
    3: 'tres',
    4: 'cuatro',
    5: 'cinco',
    6: 'seis',
    7: 'siete',
}

# Asegurarse de que 'puertas' es numérico antes del mapeo
df_cars['puertas'] = pd.to_numeric(df_cars['puertas'], errors='coerce')

# Aplicar conversión a texto
df_cars['puertas'] = df_cars['puertas'].map(numero_a_texto).fillna('desconocido')

# Añadir columna con año de nacimiento
df_customers['añoNacimiento'] = pd.to_datetime(df_customers['fechaNacimiento'], errors='coerce').dt.year

# 🚗 SEPARAR COCHES POR CLIENTE

# 1. Reemplazar clienteId vacío por 'Disponible'
df_cars['clienteId'] = df_cars['clienteId'].replace(['', 'Sin dato', None, pd.NA], pd.NA)
df_cars['clienteId'] = df_cars['clienteId'].fillna('Disponible')

# 2. Separar DataFrames
df_cars_con_cliente = df_cars[df_cars['clienteId'] != 'Disponible']
df_cars_disponibles = df_cars[df_cars['clienteId'] == 'Disponible']

# Coches con cliente
df_cars_con_cliente.to_csv('resultados/coches_con_cliente.csv', index=False)
df_cars_con_cliente.to_json('resultados/coches_con_cliente.json', orient='records', force_ascii=False, indent=2)

# Coches disponibles
df_cars_disponibles.to_csv('resultados/coches_disponibles.csv', index=False)
df_cars_disponibles.to_json('resultados/coches_disponibles.json', orient='records', force_ascii=False, indent=2)

# Todos los coches
df_cars.to_csv('resultados/coches_todos.csv', index=False)
df_cars.to_json('resultados/coches_todos.json', orient='records', force_ascii=False, indent=2)

# Convertir a datetime (sobrescribiendo)
df_customers['fechaNacimiento'] = pd.to_datetime(df_customers['fechaNacimiento'], errors='coerce')

# Formatear como string sin hora
df_customers['fechaNacimiento'] = df_customers['fechaNacimiento'].dt.strftime('%d/%m/%Y')

# Ordenar por fecha de nacimiento (los más mayores primero)
df_ordenados = df_customers.sort_values(by='fechaNacimiento', ascending=True)

# Clientes ordenados por fecha
df_ordenados.to_csv('resultados/clientes_ordenados_por_fecha.csv', index=False)
df_ordenados.to_json('resultados/clientes_ordenados_por_fecha.json', orient='records', force_ascii=False, indent=2)

print("✅ Exportación completa: coches disponibles y asignados separados.")
