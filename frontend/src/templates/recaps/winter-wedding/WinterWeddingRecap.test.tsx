import{render,screen}from'@testing-library/react'
import{WinterWeddingRecap}from'./WinterWeddingRecap'
describe('WinterWeddingRecap',()=>{it('renders the recap story and generated imagery',()=>{const{container}=render(<WinterWeddingRecap/>);expect(screen.getByRole('heading',{level:1,name:/Minh Anh.*Hoàng Nam/i})).toBeInTheDocument();expect(screen.getByText('Chiếc nhẫn và lời nguyện ước')).toBeInTheDocument();expect(container.querySelectorAll('[data-editor-section]')).toHaveLength(5);expect(container.querySelectorAll('.wwr-filmstrip img')).toHaveLength(3)})})
