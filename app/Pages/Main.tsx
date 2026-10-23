import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import {
    Alert,
    Box,
    Button,
    ButtonBase,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Menu,
    MenuItem,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Tooltip,
    Typography,
    createFilterOptions,
    useTheme,
} from '@mui/material'

import {
    Add as AddIcon,
} from '@mui/icons-material'

import ItemContainer from '../Components/ItemContainer'
import ItemIcon, { iconNames } from '../Components/ItemIcon'
import ItemTitle from '../Components/ItemTitle'

import { ShortCuts, DefaultShortCuts as defaultGroups } from '../ShortCuts'
import { SavedShortCutsType } from '../ShortCutsType'

const filterIcons = createFilterOptions<string>()
const isExtension = window.location.protocol === 'chrome-extension:'

export default function Main({ editing }: { editing: boolean }) {

    const theme = useTheme()
    const [groups, setGroups] = useState<SavedShortCutsType>(isExtension ? [] : defaultGroups)
    const customGroups = groups.at(-1)?.length === 0 ? groups : [...groups, []]
    const [loaded, setLoaded] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [edit, setEdit] = useState<{
        group: number,
        index: number | null,
        item?: SavedShortCutsType[number][number],
    } | null>(null)
    const [menu, setMenu] = useState<{ group: number, index: number, x: number, y: number } | null>(null)
    const [confirm, setConfirm] = useState<{ group: number, index: number, text: string } | null>(null)
    const [iconType, setIconType] = useState('favicon')
    const [favicon, setFavicon] = useState<'default' | 'google'>('google')
    const [icon, setIcon] = useState<string | null>(null)
    const [iconSearch, setIconSearch] = useState('')
    const [iconCount, setIconCount] = useState(120)
    const filteredIcons = filterIcons(iconNames, { inputValue: iconSearch, getOptionLabel: name => name })
    const iconList = useRef<HTMLDivElement | null>(null)
    const groupRef = useRef<HTMLDivElement | null>(null)
    const [columns, setColumns] = useState(1)
    const hold = useRef<number | undefined>(undefined)
    const press = useRef({ x: 0, y: 0, held: false })

    useLayoutEffect(() => {
        const group = groupRef.current!
        function resize() {
            setColumns(Math.max(1, Math.floor((group.clientWidth - 32 + 8) / 104)))
        }
        resize()
        const observer = new ResizeObserver(resize)
        observer.observe(group)
        return () => {
            observer.disconnect()
            window.clearTimeout(hold.current)
        }
    }, [])

    useEffect(() => {
        if (!isExtension) {
            return
        }

        let active = true
        let changed = false
        chrome.storage.local.get<{ shortcuts?: SavedShortCutsType }>('shortcuts').then(async data => {
            if (!active) {
                return
            }
            const items: SavedShortCutsType = data.shortcuts ?? defaultGroups
            if (data.shortcuts === undefined && !changed) {
                await chrome.storage.local.set({ shortcuts: items })
            }
            if (active) {
                if (!changed) {
                    setGroups(items)
                }
                setLoaded(true)
            }
        }).catch((error: Error) => {
            if (active) {
                setError(error.message)
            }
        })

        function change(changes: Record<string, chrome.storage.StorageChange>, area: string) {
            if (area === 'local' && changes.shortcuts) {
                changed = true
                window.clearTimeout(hold.current)
                setGroups((changes.shortcuts.newValue as SavedShortCutsType | undefined) ?? defaultGroups)
                setConfirm(null)
                setMenu(null)
                setEdit(current => current?.index === null ? current : null)
            }
        }

        chrome.storage.onChanged.addListener(change)
        return () => {
            active = false
            chrome.storage.onChanged.removeListener(change)
        }
    }, [])

    async function save(items: SavedShortCutsType) {
        setSaving(true)
        setError('')
        try {
            await chrome.storage.local.set({ shortcuts: items })
            setEdit(null)
            setConfirm(null)
        } catch (error) {
            setError((error as Error).message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <Stack
            component='main'
            sx={{
                width: '100%',
                minWidth: 0,
                paddingTop: 4,
                paddingBottom: 1,
                userSelect: 'none',
                [theme.breakpoints.up('sm')]: {
                    width: '65vw',
                },
            }}
        >
            {error && edit === null && confirm === null && <Alert severity='error'>{error}</Alert>}
            {
                [...ShortCuts, ...customGroups].map((items, index1) => {
                    const buttons = items.map((item, index2) => (
                        <Box
                            key={index2}
                            onContextMenu={e => {
                                if (!loaded || saving || index1 < ShortCuts.length) {
                                    return
                                }
                                e.preventDefault()
                                window.clearTimeout(hold.current)
                                setMenu({ group: index1 - ShortCuts.length, index: index2, x: e.clientX, y: e.clientY })
                            }}
                            onPointerDown={e => {
                                if (!loaded || saving || index1 < ShortCuts.length || e.button !== 0) {
                                    return
                                }
                                window.clearTimeout(hold.current)
                                const { clientX: x, clientY: y } = e
                                hold.current = window.setTimeout(() => {
                                    press.current.held = true
                                    setMenu({ group: index1 - ShortCuts.length, index: index2, x, y })
                                }, 500)
                            }}
                        >
                            <ItemContainer href={item.link}>
                                <ItemIcon elevation={8} icon={item.icon} link={item.link} color={item.color} favicon={item.favicon} />
                                <ItemTitle text={item.text} />
                            </ItemContainer>
                        </Box>
                    ))
                    if (editing && isExtension && index1 >= ShortCuts.length && items.length < 8) {
                        buttons.push(
                            <ButtonBase
                                key='add'
                                disableRipple
                                disabled={!loaded || saving}
                                onClick={() => {
                                    setError('')
                                    setIconType('favicon')
                                    setFavicon('google')
                                    setIcon(null)
                                    setIconSearch('')
                                    setIconCount(120)
                                    setEdit({ group: index1 - ShortCuts.length, index: null })
                                }}
                                sx={theme => ({
                                    width: 96,
                                    height: 96,
                                    flexShrink: 0,
                                    flexDirection: 'column',
                                    color: 'inherit',
                                    borderRadius: theme.shape.borderRadius,
                                    '&:hover': {
                                        boxShadow: theme.shadows[16],
                                    },
                                })}
                            >
                                <ItemIcon elevation={8} icon={<AddIcon />} link='' color='inherit' />
                                <ItemTitle text='添加' />
                            </ButtonBase>
                        )
                    }
                    if (buttons.length === 0) {
                        return null
                    }
                    const count = Math.ceil(buttons.length / columns)
                    return (
                        <Stack
                            key={index1}
                            ref={index1 === 0 ? groupRef : undefined}
                            spacing={1}
                            onPointerDown={e => {
                                if (e.button === 0) {
                                    press.current = { x: e.clientX, y: e.clientY, held: false }
                                }
                            }}
                            onPointerMove={e => {
                                if (Math.abs(e.clientX - press.current.x) > 5 || Math.abs(e.clientY - press.current.y) > 5) {
                                    window.clearTimeout(hold.current)
                                }
                            }}
                            onPointerUp={() => window.clearTimeout(hold.current)}
                            onPointerCancel={() => {
                                window.clearTimeout(hold.current)
                                press.current.held = false
                            }}
                            onPointerLeave={() => window.clearTimeout(hold.current)}
                            onClickCapture={e => {
                                if (press.current.held) {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    press.current.held = false
                                }
                            }}
                            onDragStart={e => e.preventDefault()}
                            sx={{ paddingX: 2, paddingY: 1 }}
                        >
                            {Array.from({ length: count }, (_, row) => (
                                <Stack
                                    key={row}
                                    spacing={1}
                                    direction='row'
                                    sx={{ alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {buttons.slice(
                                        Math.ceil(row * buttons.length / count),
                                        Math.ceil((row + 1) * buttons.length / count),
                                    )}
                                </Stack>
                            ))}
                        </Stack>
                    )
                })
            }
            <Menu
                open={menu !== null}
                onClose={() => setMenu(null)}
                anchorReference='anchorPosition'
                anchorPosition={menu ? { top: menu.y, left: menu.x } : undefined}
            >
                <MenuItem onClick={() => {
                    if (menu) {
                        const item = groups[menu.group][menu.index]
                        const builtin = iconNames.includes(item.icon ?? '')
                        setError('')
                        setIconType(builtin ? 'builtin' : item.icon ? 'url' : 'favicon')
                        setFavicon(item.favicon ?? 'default')
                        setIcon(builtin ? item.icon as string : null)
                        setIconSearch('')
                        setIconCount(120)
                        setEdit({ group: menu.group, index: menu.index, item })
                        setMenu(null)
                    }
                }}>编辑</MenuItem>
                <MenuItem onClick={() => {
                    if (menu) {
                        setError('')
                        setConfirm({ group: menu.group, index: menu.index, text: groups[menu.group][menu.index].text })
                        setMenu(null)
                    }
                }}>删除</MenuItem>
            </Menu>
            <Dialog open={edit !== null} onClose={() => { if (!saving) setEdit(null) }} fullWidth maxWidth='sm'>
                {edit !== null && (
                    <Box
                        component='form'
                        noValidate
                        onSubmit={e => {
                            e.preventDefault()
                            if (edit.index === null && (groups[edit.group]?.length ?? 0) >= 8) {
                                setError('该分组最多添加 8 个快捷方式')
                                return
                            }
                            const data = new FormData(e.currentTarget)
                            const link = (data.get('link') as string).trim()
                            const item = {
                                ...edit.item,
                                text: (data.get('text') as string).trim(),
                                link,
                                icon: iconType === 'builtin'
                                    ? icon ?? undefined
                                    : iconType === 'url' ? (data.get('icon') as string).trim() : undefined,
                                favicon: iconType === 'favicon' ? favicon : undefined,
                            }
                            const items = groups.slice()
                            items[edit.group] = [...(groups[edit.group] ?? [])]
                            if (edit.index === null) {
                                items[edit.group].push(item)
                            } else {
                                items[edit.group][edit.index] = item
                            }
                            void save(items)
                        }}
                    >
                        <DialogTitle>{edit.index === null ? '添加快捷方式' : '编辑快捷方式'}</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2} sx={{ paddingTop: 1 }}>
                                {error && <Alert severity='error'>{error}</Alert>}
                                <TextField name='text' label='名称' defaultValue={edit.item?.text ?? ''} autoFocus disabled={saving} />
                                <TextField
                                    name='link'
                                    label='URL'
                                    defaultValue={edit.item?.link ?? ''}
                                    disabled={saving}
                                />
                                <RadioGroup row value={iconType} onChange={e => setIconType(e.target.value)}>
                                    <FormControlLabel value='favicon' control={<Radio disabled={saving} />} label='自动 Favicon' />
                                    <FormControlLabel value='builtin' control={<Radio disabled={saving} />} label='内置图标' />
                                    <FormControlLabel value='url' control={<Radio disabled={saving} />} label='图片 URL' />
                                </RadioGroup>
                                {iconType === 'favicon' && (
                                    <RadioGroup row value={favicon} onChange={e => setFavicon(e.target.value as 'default' | 'google')}>
                                        <FormControlLabel value='default' control={<Radio disabled={saving} />} label='/favicon.ico' />
                                        <FormControlLabel value='google' control={<Radio disabled={saving} />} label='Google Favicon' />
                                    </RadioGroup>
                                )}
                                {iconType === 'url' && (
                                    <TextField name='icon' label='图片 URL' defaultValue={iconNames.includes(edit.item?.icon ?? '') ? '' : edit.item?.icon ?? ''} multiline disabled={saving} />
                                )}
                                {iconType === 'builtin' && (
                                    <Stack spacing={1}>
                                        <TextField
                                            label='搜索图标'
                                            value={iconSearch}
                                            onChange={e => {
                                                setIconSearch(e.target.value)
                                                setIconCount(120)
                                                iconList.current?.scrollTo({ top: 0 })
                                            }}
                                            disabled={saving}
                                        />
                                        <Typography variant='caption'>共 {iconNames.length} 个图标，匹配 {filteredIcons.length} 个</Typography>
                                        <Box
                                            ref={iconList}
                                            onScroll={e => {
                                                const list = e.currentTarget
                                                if (list.scrollHeight - list.scrollTop - list.clientHeight < 96 && iconCount < filteredIcons.length) {
                                                    setIconCount(iconCount + 120)
                                                }
                                            }}
                                            sx={{
                                                maxHeight: 320,
                                                overflowY: 'auto',
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                                                gap: 1,
                                            }}
                                        >
                                            {filteredIcons.slice(0, iconCount).map(name => (
                                                <Tooltip key={name} title={name}>
                                                    <Button
                                                        color='inherit'
                                                        variant={icon === name ? 'contained' : 'text'}
                                                        onClick={() => setIcon(name)}
                                                        disabled={saving}
                                                        sx={{ minWidth: 0, height: 96, flexDirection: 'column', gap: 1, textTransform: 'none' }}
                                                    >
                                                        <ItemIcon icon={name} link='' color={edit.item?.color} />
                                                        <Typography variant='caption' noWrap sx={{ width: '100%' }}>{name}</Typography>
                                                    </Button>
                                                </Tooltip>
                                            ))}
                                            {filteredIcons.length === 0 && <Typography>没有匹配的图标</Typography>}
                                        </Box>
                                    </Stack>
                                )}
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEdit(null)} disabled={saving}>取消</Button>
                            <Button type='submit' disabled={saving}>{edit.index === null ? '添加' : '保存'}</Button>
                        </DialogActions>
                    </Box>
                )}
            </Dialog>
            <Dialog open={confirm !== null} onClose={() => { if (!saving) setConfirm(null) }}>
                <DialogTitle>删除快捷方式</DialogTitle>
                <DialogContent>
                    {error && <Alert severity='error'>{error}</Alert>}
                    <DialogContentText>确认删除「{confirm?.text}」？</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirm(null)} disabled={saving}>取消</Button>
                    <Button
                        color='error'
                        disabled={saving}
                        onClick={() => {
                            if (confirm) {
                                void save(groups.map((items, index) => (
                                    index === confirm.group ? items.filter((_, index2) => index2 !== confirm.index) : items
                                )))
                            }
                        }}
                    >删除</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}
