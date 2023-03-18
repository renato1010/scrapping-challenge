import { Layout } from '../../Layout';
import Alert from './Alert';
import Card from './Card';
import Forms from './Forms';
import Headings from './Headings';
import Notification from './Notification';
import Table from './Table';

export default function Design() {
  return (
    <Layout header='Design'>
      <h2 className='text-4xl font-bold mb-8'>Forms</h2>
      <Forms />
      <hr className='py-12' />
      <h2 className='text-4xl font-bold mb-8'>Card</h2>
      <Card />
      <hr className='py-12' />
      <h2 className='text-4xl font-bold mb-8'>Heading</h2>
      <Headings />
      <hr className='py-12' />
      <h2 className='text-4xl font-bold mb-8'>Table</h2>
      <Table />
      <hr className='py-12' />
      <h2 className='text-4xl font-bold mb-8'>Alert</h2>
      <Alert />
      <Notification />
    </Layout>
  );
}
