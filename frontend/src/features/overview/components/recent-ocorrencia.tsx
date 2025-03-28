import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import OcorrenciaLatest from '@/features/ocorrencia/components/ocorrencia-latest';

export function RecentOcorrencia() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Ocorrências</CardTitle>
        <CardDescription>As últimas 4 (quatro) ocorrências</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          <OcorrenciaLatest />
        </div>
      </CardContent>
    </Card>
  );
}
