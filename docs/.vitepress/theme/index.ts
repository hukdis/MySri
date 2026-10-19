import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'
import MermaidDiagram from './MermaidDiagram.vue'
import AtlasLayout from './AtlasLayout.vue'
import HomeDashboard from './HomeDashboard.vue'
import PaperFigure from './PaperFigure.vue'
import CadExplorer from './CadExplorer.vue'
import CadRelations from './CadRelations.vue'
export default {
  extends: DefaultTheme,
  Layout: AtlasLayout,
  enhanceApp({app}) { app.component('MermaidDiagram', MermaidDiagram); app.component('HomeDashboard', HomeDashboard); app.component('PaperFigure', PaperFigure); app.component('CadExplorer', CadExplorer); app.component('CadRelations', CadRelations) }
} satisfies Theme
