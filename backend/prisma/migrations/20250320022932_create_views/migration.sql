CREATE VIEW "OcorrenciasUnidade" AS
    SELECT ue.id, pj.nome_fantasia AS escola,
        COUNT(o.id) AS total_ocorrencias
    FROM ocorrencia o
    JOIN unidade_escolar ue ON o.unidade_id = ue.id
	JOIN pessoa p on p.id = ue.pessoa_id
	JOIN pessoa_juridica pj on pj.pessoa_id = p.id
    GROUP BY ue.id, pj.nome_fantasia
    ORDER BY total_ocorrencias DESC;

CREATE VIEW "OcorrenciasTipo" AS
    SELECT toco.id, toco.nome AS tipo_ocorrencia,
        COUNT(o.id) AS total
    FROM ocorrencia o
    JOIN tipo_ocorrencia toco ON o.tipo_id = toco.id
    GROUP BY toco.id, toco.nome
    ORDER BY total DESC;

CREATE VIEW "OcorrenciasMes" AS
    SELECT TO_CHAR(data, '%m-%Y') AS mes,
        COUNT(*) AS total_ocorrencias
    FROM ocorrencia
    GROUP BY mes
    ORDER BY mes;

CREATE VIEW "OcorrenciasEnvolvidos" AS
    SELECT o.id,
        e.nome AS nome_envolvido,
        e.tipo AS tipo_envolvido,
        eo.papel
    FROM envolvido_ocorrencia eo
    JOIN envolvido e ON eo.envolvido_id = e.id
    JOIN ocorrencia o ON eo.ocorrencia_id = o.id
    ORDER BY o.id;

CREATE VIEW "OcorrenciasResponsavel" AS
    SELECT o.id,
        pj.nome_fantasia AS escola,
        toco.nome AS tipo,
        o.data as data_ocorrencia,
        o.local,
        rr.nome AS registrado_por
    FROM ocorrencia o
    JOIN unidade_escolar ue ON o.unidade_id = ue.id
	JOIN pessoa p on p.id = ue.pessoa_id
	JOIN pessoa_juridica pj on pj.pessoa_id = p.id
    JOIN tipo_ocorrencia toco ON o.tipo_id = toco.id
    JOIN responsavel_registro rr ON o.responsavel_id = rr.id
    ORDER BY o.data DESC;
