CREATE OR REPLACE VIEW "ocorrencias_anual" AS
    SELECT 
        ROW_NUMBER() OVER (ORDER BY ano, mes) AS sequencia,
        mes,
        ano,
        total
    FROM (
        SELECT 
            EXTRACT(MONTH FROM data) AS mes,
            EXTRACT(YEAR FROM data) AS ano,
            COUNT(*) AS total
        FROM ocorrencia
        WHERE EXTRACT(YEAR FROM data) IN (EXTRACT(YEAR FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE) - 1)
        GROUP BY ano, mes
    ) subquery
    ORDER BY ano, mes;