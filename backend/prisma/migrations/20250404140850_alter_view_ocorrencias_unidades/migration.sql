DROP VIEW IF EXISTS ocorrencias_unidades;
CREATE VIEW "ocorrencias_unidades" AS
    SELECT ue.id, pj.nome_fantasia AS escola,
        COALESCE(COUNT(o.id), 0)::numeric AS total_ocorrencias
    FROM ocorrencia o
    JOIN unidade_escolar ue ON o.unidade_id = ue.id
	JOIN pessoa p on p.id = ue.pessoa_id
	JOIN pessoa_juridica pj on pj.pessoa_id = p.id
    GROUP BY ue.id, pj.nome_fantasia
    ORDER BY total_ocorrencias DESC;