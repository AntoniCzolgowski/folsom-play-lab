import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import {defineConfig} from 'vite';
// Local static application: no Cloudflare worker, authentication or cloud bindings.
export default defineConfig({css:{postcss:{plugins:[tailwindcss()]}},plugins:[vinext()],server:{host:'127.0.0.1',port:5173}});
