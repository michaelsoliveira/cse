SELECT
  1 AS id,
  (
    SELECT
      count(*) AS count
    FROM
      unidade_escolar
  ) AS total_escolas,
  (
    SELECT
      count(*) AS count
    FROM
      ocorrencia
  ) AS total_ocorrencias,
  (
    SELECT
      count(*) AS count
    FROM
      ocorrencia
    WHERE
      (
        date_trunc(
          'month' :: text,
          (ocorrencia.data) :: timestamp WITH time zone
        ) = date_trunc(
          'month' :: text,
          (CURRENT_DATE) :: timestamp WITH time zone
        )
      )
  ) AS total_ocorrencias_mes;