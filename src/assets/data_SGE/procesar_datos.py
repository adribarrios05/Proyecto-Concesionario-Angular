import pandas as pd
import json
import os

# 📁 Crear carpeta resultados si no existe
os.makedirs('resultados', exist_ok=True)

# 📥 Cargar archivo JSON
with open('datos_completos.json', encoding='utf-8') as file:
    data = json.load(file)

# 📊 Crear DataFrames
df_customers = pd.DataFrame(data['customers'])
df_cars = pd.DataFrame(data['cars'])

# 💡 Asegurar que existe la columna 'customer' y que tenga None si falta
if 'customer' not in df_cars.columns:
    df_cars['customer'] = None
else:
    df_cars['customer'] = df_cars['customer'].apply(
        lambda x: x if x not in [None, '', 'No data'] else None
    )

# 🧹 Limpieza básica (excepto campo 'customer')
for col in df_customers.columns:
    if df_customers[col].dtype == 'object':
        df_customers[col] = df_customers[col].apply(lambda x: x.strip() if isinstance(x, str) else x)

for col in df_cars.columns:
    if col != 'customer' and df_cars[col].dtype == 'object':
        df_cars[col] = df_cars[col].apply(lambda x: x.strip() if isinstance(x, str) else x)

# 🔢 Convertir número de puertas a texto
number_to_text = {
    1: 'one', 2: 'two', 3: 'three', 4: 'four',
    5: 'five', 6: 'six', 7: 'seven'
}
df_cars['doors'] = pd.to_numeric(df_cars['doors'], errors='coerce')
df_cars['doors'] = df_cars['doors'].map(number_to_text).fillna('unknown')

# 📅 Añadir año de nacimiento
df_customers['birthYear'] = pd.to_datetime(df_customers['birthDate'], errors='coerce').dt.year

# 🧩 Rellenar vacíos (excepto campo customer)
df_customers.fillna('Unknown', inplace=True)
df_cars.fillna(value={col: 'No data' for col in df_cars.columns if col != 'customer'}, inplace=True)

# 🚗 Separar coches con y sin cliente (null → disponible)
df_cars_available = df_cars[df_cars['customer'].isnull()]
df_cars_with_customer = df_cars[df_cars['customer'].notnull()]

# 💾 Exportar JSON
df_cars_with_customer.to_json('resultados/cars_with_customer.json', orient='records', force_ascii=False, indent=2)
df_cars_available.to_json('resultados/cars_available.json', orient='records', force_ascii=False, indent=2)
df_cars.to_json('resultados/all_cars.json', orient='records', force_ascii=False, indent=2)

# 💾 Exportar CSV
df_cars_with_customer.to_csv('resultados/cars_with_customer.csv', index=False)
df_cars_available.to_csv('resultados/cars_available.csv', index=False)
df_cars.to_csv('resultados/all_cars.csv', index=False)

# 🗓️ Formatear fecha
df_customers['birthDate'] = pd.to_datetime(df_customers['birthDate'], errors='coerce')
df_customers['birthDate'] = df_customers['birthDate'].dt.strftime('%d/%m/%Y')

# 👴 Ordenar clientes por fecha
df_sorted = df_customers.sort_values(by='birthDate', ascending=True)

# 💾 Exportar clientes
df_sorted.to_json('resultados/customers_sorted_by_birth.json', orient='records', force_ascii=False, indent=2)
df_sorted.to_csv('resultados/customers_sorted_by_birth.csv', index=False)

print("✅ Exportación finalizada correctamente.")
