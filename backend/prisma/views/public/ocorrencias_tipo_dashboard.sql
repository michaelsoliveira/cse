SELECT
  (
    row_number() OVER (
      ORDER BY
        (count(o.id)) DESC
    )
  ) :: numeric AS sequencia,
  t.nome AS tipo,
  COALESCE(count(o.id), (0) :: bigint) AS total
FROM
  (
    tipo_ocorrencia t
    LEFT JOIN ocorrencia o ON ((o.tipo_id = t.id))
  )
GROUP BY
  t.id,
  t.nome
ORDER BY
  t.nome;