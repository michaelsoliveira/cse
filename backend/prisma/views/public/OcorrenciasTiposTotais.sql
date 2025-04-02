SELECT
  1 AS id,
  count(*) FILTER (
    WHERE
      (t.nome = 'Furto' :: text)
  ) AS furto,
  count(*) FILTER (
    WHERE
      (t.nome = 'Roubo' :: text)
  ) AS roubo,
  count(*) FILTER (
    WHERE
      (t.nome = 'Vulnerabilidade' :: text)
  ) AS vulnerabilidade,
  count(*) FILTER (
    WHERE
      (t.nome = 'Intrusão' :: text)
  ) AS intrusao,
  count(*) FILTER (
    WHERE
      (t.nome = 'Ameaça' :: text)
  ) AS ameaca,
  count(*) FILTER (
    WHERE
      (t.nome = 'Uso de Arma de Fogo' :: text)
  ) AS uso_arma,
  count(*) FILTER (
    WHERE
      (t.nome = 'Porte de Arma' :: text)
  ) AS porte_arma,
  count(*) FILTER (
    WHERE
      (t.nome = 'Danos ao Patrimônio' :: text)
  ) AS danos_patrimonio,
  count(*) FILTER (
    WHERE
      (t.nome = 'Ameaça a Escola' :: text)
  ) AS ameaca_escola
FROM
  (
    ocorrencia o
    JOIN tipo_ocorrencia t ON ((o.tipo_id = t.id))
  );