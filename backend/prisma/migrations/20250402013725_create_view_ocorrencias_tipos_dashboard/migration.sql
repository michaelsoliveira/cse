DROP VIEW IF EXISTS ocorrencias_tipo_dashboard;
CREATE VIEW ocorrencias_tipo_dashboard AS
  SELECT 
      ROW_NUMBER() OVER (ORDER BY COUNT(o.id) DESC)::numeric AS sequencia,
      t.nome AS tipo, 
      COALESCE(COUNT(o.id), 0) AS total
  FROM tipo_ocorrencia t
  LEFT JOIN ocorrencia o ON o.tipo_id = t.id
  GROUP BY t.id, t.nome
  ORDER BY t.nome ASC;