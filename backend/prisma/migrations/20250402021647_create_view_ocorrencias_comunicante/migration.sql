CREATE OR REPLACE VIEW "ocorrencias_comunicante" AS
    SELECT 
        o.id,
        pj.nome_fantasia AS escola,
        toco.nome AS tipo,
        o.data AS data_ocorrencia,
        COALESCE(pf.nome, pj_com.nome_fantasia) AS comunicante
    FROM ocorrencia o
    JOIN unidade_escolar ue ON o.unidade_id = ue.id
    JOIN pessoa p ON p.id = ue.pessoa_id
    JOIN pessoa_juridica pj ON pj.pessoa_id = p.id
    JOIN tipo_ocorrencia toco ON o.tipo_id = toco.id
    JOIN comunicante c ON c.id = o.comunicante_id
    JOIN pessoa p_com ON p_com.id = c.pessoa_id
    LEFT JOIN pessoa_fisica pf ON pf.pessoa_id = p_com.id
    LEFT JOIN pessoa_juridica pj_com ON pj_com.pessoa_id = p_com.id
    ORDER BY o.data DESC;