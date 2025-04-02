SELECT
  (
    row_number() OVER (
      ORDER BY
        (
          EXTRACT(
            year
            FROM
              data
          )
        ),
        (
          EXTRACT(
            MONTH
            FROM
              data
          )
        )
    )
  ) :: numeric AS sequencia,
  EXTRACT(
    MONTH
    FROM
      data
  ) AS mes,
  EXTRACT(
    year
    FROM
      data
  ) AS ano,
  (count(*)) :: numeric AS total_ocorrencias
FROM
  ocorrencia
GROUP BY
  (
    EXTRACT(
      year
      FROM
        data
    )
  ),
  (
    EXTRACT(
      MONTH
      FROM
        data
    )
  )
ORDER BY
  (
    EXTRACT(
      year
      FROM
        data
    )
  ),
  (
    EXTRACT(
      MONTH
      FROM
        data
    )
  );