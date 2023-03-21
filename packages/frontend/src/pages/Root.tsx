import './Root.css';
import { Layout } from '../Layout';
import { ScanForm } from '../components/scan-form';

export default function Root() {
  return (
    <Layout header='Scan URL'>
      <ScanForm />
    </Layout>
  );
}
