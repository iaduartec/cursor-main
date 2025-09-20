  console.warn('✅ Migraciones aplicadas')
}

main().catch((err) => {
  console.error('❌ Error migrando:', err)
  process.exit(1)
})
