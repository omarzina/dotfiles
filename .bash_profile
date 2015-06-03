export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced

#-------------------
# Personnal Aliases
#-------------------

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
# -> Prevents accidentally clobbering files.
alias mkdir='mkdir -p'
alias ..='cd ..'
alias du='du -kh'    # Makes a more readable output.
alias df='df -kTh'

alias l='ls -lh'
alias la='ls -lah'           #  Show hidden files.

#alias lx='ls -lXB'         #  Sort by extension.
#alias lk='ls -lSr'         #  Sort by size, biggest last.
#alias lt='ls -ltr'         #  Sort by date, most recent last.
#alias lc='ls -ltcr'        #  Sort by/show change time,most recent last.
#alias lu='ls -ltur'        #  Sort by/show access time,most recent last.

# The ubiquitous 'll': directories first, with alphanumeric sorting:
#alias ll="ls -lv --group-directories-first"
#alias lm='ll |more'        #  Pipe through 'more'
#alias lr='ll -R'           #  Recursive ls.


[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*

source ~/.profile
