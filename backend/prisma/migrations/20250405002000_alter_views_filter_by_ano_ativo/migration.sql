DROP VIEW ocorrencias_tipo;
CREATE VIEW "ocorrencias_tipo" AS
    SELECT toco.id, toco.nome AS tipo_ocorrencia,
        COUNT(o.id) AS total
    FROM ocorrencia o
    JOIN tipo_ocorrencia toco ON o.tipo_id = toco.id
	JOIN parametro par ON par.nome = 'ano_ativo'
	WHERE EXTRACT(YEAR FROM o.data) = CAST(par.valor AS INTEGER)
    GROUP BY toco.id, toco.nome
    ORDER BY total DESC;

DROP VIEW ocorrencias_unidades;
CREATE VIEW "ocorrencias_unidades" AS
SELECT 
    ue.id, 
    pj.nome_fantasia AS escola,
    COUNT(o.id) AS total_ocorrencias
FROM ocorrencia o
JOIN unidade_escolar ue ON o.unidade_id = ue.id
JOIN pessoa p ON p.id = ue.pessoa_id
JOIN pessoa_juridica pj ON pj.pessoa_id = p.id
JOIN parametro par ON par.nome = 'ano_ativo'
WHERE EXTRACT(YEAR FROM o.data) = CAST(par.valor AS INTEGER)
GROUP BY ue.id, pj.nome_fantasia
ORDER BY total_ocorrencias DESC;

DROP VIEW ocorrencias_mes;
CREATE VIEW "ocorrencias_mes" AS
    SELECT 
        ROW_NUMBER() OVER (ORDER BY EXTRACT(MONTH FROM o.data)) AS sequencia,
        EXTRACT(MONTH FROM o.data) AS mes,
        EXTRACT(YEAR FROM o.data) AS ano,
        COUNT(*) AS total_ocorrencias
    FROM ocorrencia o
	JOIN parametro par ON par.nome = 'ano_ativo'
	WHERE EXTRACT(YEAR FROM o.data) = CAST(par.valor AS INTEGER)
    GROUP BY ano, mes
    ORDER BY ano, mes;
	
DROP VIEW IF EXISTS totais_dashboard;
CREATE VIEW "totais_dashboard" AS
SELECT
    1 AS id,
  (SELECT COALESCE(COUNT(*), 0)::numeric FROM unidade_escolar) AS total_escolas,
  (
        SELECT COUNT(*)::numeric 
        FROM ocorrencia o
        JOIN parametro par ON par.nome = 'ano_ativo'
        WHERE EXTRACT(YEAR FROM o.data) = CAST(par.valor AS INTEGER)
    ) AS total_ocorrencias,
  (SELECT COUNT(*) 
   FROM ocorrencia o
   JOIN parametro par ON par.nome = 'ano_ativo'
WHERE EXTRACT(YEAR FROM o.data) = CAST(par.valor AS INTEGER)
   AND DATE_TRUNC('month', o.data) = DATE_TRUNC('month', now())
  )::numeric AS total_ocorrencias_mes;
  
DROP VIEW IF EXISTS ocorrencias_tipo_dashboard;
CREATE VIEW ocorrencias_tipo_dashboard AS
  WITH ano_param AS (
  SELECT CAST(valor AS INTEGER) AS ano_ativo FROM parametro
WHERE nome = 'ano_ativo'
),
ocorrencias_filtradas AS (
  SELECT *
  FROM ocorrencia o
  JOIN ano_param ap ON EXTRACT(YEAR FROM o.data) = ap.ano_ativo
)
SELECT 
    ROW_NUMBER() OVER (ORDER BY COUNT(ofi.id) DESC)::numeric AS sequencia,
    t.nome AS tipo, 
    COALESCE(COUNT(ofi.id), 0)::numeric AS total
FROM tipo_ocorrencia t
LEFT JOIN ocorrencias_filtradas ofi ON ofi.tipo_id = t.id
GROUP BY t.id, t.nome
ORDER BY t.nome ASC;

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