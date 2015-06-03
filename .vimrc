" Con esto logro que ande TAB completion por ejemplo
set nocompatible              " be iMproved, required

filetype off                  " required

execute pathogen#infect()

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
" alternatively, pass a path where Vundle should install plugins
"call vundle#begin('~/some/path/here')

" let Vundle manage Vundle, required
Plugin 'gmarik/Vundle.vim'

" The following are examples of different formats supported.
" Keep Plugin commands between vundle#begin/end.
" plugin on GitHub repo
"Plugin 'tpope/vim-fugitive'
" plugin from http://vim-scripts.org/vim/scripts.html
"Plugin 'L9'
" Git plugin not hosted on GitHub
"Plugin 'git://git.wincent.com/command-t.git'
" git repos on your local machine (i.e. when working on your own plugin)
"Plugin 'file:///home/gmarik/path/to/plugin'
" The sparkup vim script is in a subdirectory of this repo called vim.
" Pass the path to set the runtimepath properly.
"Plugin 'rstacruz/sparkup', {'rtp': 'vim/'}
" Avoid a name conflict with L9
"Plugin 'user/L9', {'name': 'newL9'}

" My plugins
Plugin 'tpope/vim-rails'
Plugin 'tpope/vim-rake'
Plugin 'tpope/vim-bundler'
Plugin 'scrooloose/nerdtree'
Plugin 'tpope/vim-projectionist'
" Plugin 'jlanzarotta/bufexplorer'
" Plugin 'scrooloose/nerdcommenter'

" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required
" To ignore plugin indent changes, instead use:
filetype plugin on
"
" Brief help
" :PluginList          - list configured plugins
" :PluginInstall(!)    - install (update) plugins
" :PluginSearch(!) foo - search (or refresh cache first) for foo
" :PluginClean(!)      - confirm (or auto-approve) removal of unused plugins

" see :h vundle for more details or wiki for FAQ
" Put your non-Plugin stuff after this line
syntax on

:set runtimepath^=~/.vim/bundle/ctrlp.vim

:set cursorline

syntax enable
if has('gui_running')
	set background=dark
	colorscheme solarized
endif

" incremental search
:set hls is
:set autoindent
:set backspace=2   " Backspace deletes like most programs in insert mode
:set ruler

" Fuzzy finder: ignore stuff that can't be opened, and generated files
let g:fuzzy_ignore ="*.png;*.PNG;*.JPG;*.jpg;*.GIF;*.gif;vendor/**;coverage/**;tmp/**;rdoc/**"

filetype plugin indent on
:set tabstop=2
:set shiftwidth=2
:set expandtab

:set smartcase
:set ignorecase
:set noantialias

" Treat <li> and <p> tags like the block tags they are
let g:html_indent_tags = 'li\|p'

" Remap para moverse entre los split con CTRL-<letra de movimiento>
nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>

" Open new split panes to right and bottom, which feels more natural
:set splitbelow
:set splitright

" NERDTREE
" Toggle nerdtree with F10  
map <F10> :NERDTreeToggle<CR>
let NERDTreeWinSize=30

"autopen NERDTree and focus cursor in new document
autocmd VimEnter * NERDTree
autocmd VimEnter * wincmd p

set backspace=2   " Backspace deletes like most programs in insert mode
set laststatus=2  " Always display the status line

" Numbers
set number
set numberwidth=5
set noswapfile
:au FocusLost * :wa "Save on focus lost
" If the current buffer has never been saved, it will have no name,
" call the file browser to save it, otherwise just save it.
nnoremap <silent> <C-S> :if expand("%") == ""<CR>browse confirm w<CR>else<CR>confirm w<CR>endif<CR>

" It clears the search buffer when you press ,/
nmap <silent> ,/ :nohlsearch<CR>

