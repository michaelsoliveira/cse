DROP VIEW IF EXISTS ocorrencias_anual;
CREATE VIEW "ocorrencias_anual" AS
 SELECT ROW_NUMBER() OVER (ORDER BY ano, mes)::numeric AS sequencia,
    mes,
    ano,
    total
   FROM ( SELECT EXTRACT(month FROM ocorrencia.data) AS mes,
            EXTRACT(year FROM ocorrencia.data) AS ano,
            count(*)::numeric AS total
           FROM ocorrencia
          WHERE EXTRACT(year FROM ocorrencia.data) = ANY (ARRAY[EXTRACT(year FROM CURRENT_DATE), EXTRACT(year FROM CURRENT_DATE) - 1::numeric])
          GROUP BY (EXTRACT(year FROM ocorrencia.data)), (EXTRACT(month FROM ocorrencia.data))) subquery
  ORDER BY ano, mes;

DROP VIEW IF EXISTS ocorrencias_mes;
CREATE VIEW "ocorrencias_mes" AS
    SELECT 
        ROW_NUMBER() OVER (ORDER BY EXTRACT(YEAR FROM data), EXTRACT(MONTH FROM data))::numeric AS sequencia,
        EXTRACT(MONTH FROM data) AS mes,
        EXTRACT(YEAR FROM data) AS ano,
        COUNT(*)::numeric AS total_ocorrencias
    FROM ocorrencia
    GROUP BY ano, mes
    ORDER BY ano, mes;