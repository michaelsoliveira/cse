SELECT
  toco.id,
  toco.nome AS tipo_ocorrencia,
  count(o.id) AS total
FROM
  (
    ocorrencia o
    JOIN tipo_ocorrencia toco ON ((o.tipo_id = toco.id))
  )
GROUP BY
  toco.id,
  toco.nome
ORDER BY
  (count(o.id)) DESC;