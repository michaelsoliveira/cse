COPY public.estado(id, nome, uf, ibge, ddd)
FROM './database/estados.csv'
DELIMITER ';'
CSV HEADER;

COPY public.municipio(id, nome, estado_id, ibge, lat_lon)
FROM './database/municipios.csv'
DELIMITER ';'
CSV HEADER;