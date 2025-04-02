SELECT
  (
    row_number() OVER (
      ORDER BY
        ano,
        mes
    )
  ) :: numeric AS sequencia,
  mes,
  ano,
  total
FROM
  (
    SELECT
      EXTRACT(
        MONTH
        FROM
          ocorrencia.data
      ) AS mes,
      EXTRACT(
        year
        FROM
          ocorrencia.data
      ) AS ano,
      (count(*)) :: numeric AS total
    FROM
      ocorrencia
    WHERE
      (
        EXTRACT(
          year
          FROM
            ocorrencia.data
        ) = ANY (
          ARRAY [EXTRACT(year FROM CURRENT_DATE), (EXTRACT(year FROM CURRENT_DATE) - (1)::numeric)]
        )
      )
    GROUP BY
      (
        EXTRACT(
          year
          FROM
            ocorrencia.data
        )
      ),
      (
        EXTRACT(
          MONTH
          FROM
            ocorrencia.data
        )
      )
  ) subquery
ORDER BY
  ano,
  mes;