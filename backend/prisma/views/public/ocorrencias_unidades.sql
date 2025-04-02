SELECT
  ue.id,
  pj.nome_fantasia AS escola,
  count(o.id) AS total_ocorrencias
FROM
  (
    (
      (
        ocorrencia o
        JOIN unidade_escolar ue ON ((o.unidade_id = ue.id))
      )
      JOIN pessoa p ON ((p.id = ue.pessoa_id))
    )
    JOIN pessoa_juridica pj ON ((pj.pessoa_id = p.id))
  )
GROUP BY
  ue.id,
  pj.nome_fantasia
ORDER BY
  (count(o.id)) DESC;