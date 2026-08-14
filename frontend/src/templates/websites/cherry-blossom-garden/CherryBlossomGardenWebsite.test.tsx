import{render,screen}from'@testing-library/react'
import{CherryBlossomGardenWebsite}from'./CherryBlossomGardenWebsite'
import{cherryBlossomSections}from'./fixture'
beforeAll(()=>{HTMLCanvasElement.prototype.getContext=(()=>null)as typeof HTMLCanvasElement.prototype.getContext})
describe('CherryBlossomGardenWebsite',()=>{it('renders the immersive website contract',()=>{const{container}=render(<CherryBlossomGardenWebsite/>);expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Mai Anh');expect(container.querySelector('.cb-petals')).toBeInTheDocument();expect(container.querySelector('[data-editor-section="rsvp"]')).toBeInTheDocument()});it('removes disabled optional sections',()=>{const sectionConfig={...cherryBlossomSections,enabled:cherryBlossomSections.enabled.filter(key=>key!=='gallery')};const{container}=render(<CherryBlossomGardenWebsite sectionConfig={sectionConfig}/>);expect(container.querySelector('[data-editor-section="gallery"]')).not.toBeInTheDocument()})})
