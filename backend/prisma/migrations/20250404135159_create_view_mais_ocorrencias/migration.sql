DROP VIEW IF EXISTS mais_ocorrencias;
CREATE VIEW mais_ocorrencias AS
    SELECT 
        pj.nome_fantasia AS unidade_escolar,
        COUNT(o.id) AS total_ocorrencias
    FROM 
        ocorrencia o
    INNER JOIN unidade_escolar ue ON ue.id = o.unidade_id
	INNER JOIN pessoa p ON p.id = ue.pessoa_id
	INNER JOIN pessoa_juridica pj ON pj.pessoa_id = p.id
    GROUP BY 
        pj.nome_fantasia
    ORDER BY 
        total_ocorrencias DESC
    LIMIT 10;