SELECT
  o.id,
  e.nome AS nome_envolvido,
  e.tipo AS tipo_envolvido,
  eo.papel
FROM
  (
    (
      envolvido_ocorrencia eo
      JOIN envolvido e ON ((eo.envolvido_id = e.id))
    )
    JOIN ocorrencia o ON ((eo.ocorrencia_id = o.id))
  )
ORDER BY
  o.id;