CREATE OR REPLACE VIEW "ocorrencias_unidades" AS
    SELECT ue.id, pj.nome_fantasia AS escola,
        COUNT(o.id) AS total_ocorrencias
    FROM ocorrencia o
    JOIN unidade_escolar ue ON o.unidade_id = ue.id
	JOIN pessoa p on p.id = ue.pessoa_id
	JOIN pessoa_juridica pj on pj.pessoa_id = p.id
    GROUP BY ue.id, pj.nome_fantasia
    ORDER BY total_ocorrencias DESC;

CREATE OR REPLACE VIEW "ocorrencias_tipo" AS
    SELECT toco.id, toco.nome AS tipo_ocorrencia,
        COUNT(o.id) AS total
    FROM ocorrencia o
    JOIN tipo_ocorrencia toco ON o.tipo_id = toco.id
    GROUP BY toco.id, toco.nome
    ORDER BY total DESC;

CREATE OR REPLACE VIEW "ocorrencias_mes" AS
    SELECT 
        ROW_NUMBER() OVER (ORDER BY EXTRACT(MONTH FROM data)) AS sequencia,
        EXTRACT(MONTH FROM data) AS mes,
        EXTRACT(YEAR FROM data) AS ano,
        COUNT(*) AS total_ocorrencias
    FROM ocorrencia
    GROUP BY ano, mes
    ORDER BY ano, mes;

CREATE OR REPLACE VIEW "ocorrencias_envolvidos" AS
    SELECT o.id,
        e.nome AS nome_envolvido,
        e.tipo AS tipo_envolvido,
        eo.papel
    FROM envolvido_ocorrencia eo
    JOIN envolvido e ON eo.envolvido_id = e.id
    JOIN ocorrencia o ON eo.ocorrencia_id = o.id
    ORDER BY o.id;

CREATE OR REPLACE VIEW "totais_dashboard" AS
SELECT
    1 AS id,
  (SELECT COUNT(*) FROM unidade_escolar) AS total_escolas,
  (SELECT COUNT(*) FROM ocorrencia) AS total_ocorrencias,
  (SELECT COUNT(*) 
   FROM ocorrencia
   WHERE DATE_TRUNC('month', data) = DATE_TRUNC('month', CURRENT_DATE)
  ) AS total_ocorrencias_mes;

CREATE OR REPLACE VIEW "ocorrencias_tipos_totais" AS
    SELECT
        1 AS id,
        COUNT(*) FILTER (WHERE t.nome = 'Furto')   AS furto,
        COUNT(*) FILTER (WHERE t.nome = 'Roubo')      AS roubo,
        COUNT(*) FILTER (WHERE t.nome = 'Vulnerabilidade')  AS vulnerabilidade,
        COUNT(*) FILTER (WHERE t.nome = 'Intrusão')  AS intrusao,
        COUNT(*) FILTER (WHERE t.nome = 'Ameaça')  AS ameaca,
        COUNT(*) FILTER (WHERE t.nome = 'Uso de Arma de Fogo')  AS uso_arma,
        COUNT(*) FILTER (WHERE t.nome = 'Porte de Arma')  AS porte_arma,
        COUNT(*) FILTER (WHERE t.nome = 'Danos ao Patrimônio')  AS danos_patrimonio,
        COUNT(*) FILTER (WHERE t.nome = 'Ameaça a Escola')  AS ameaca_escola
    FROM ocorrencia o
    JOIN tipo_ocorrencia t ON o.tipo_id = t.id;