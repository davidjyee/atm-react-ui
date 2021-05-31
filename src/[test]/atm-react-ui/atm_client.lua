RegisterCommand('atm', function(source, args)
	local subcommand = args[1] or "show"
	local type = args[2] or "atm"

	if(subcommand == 'hide')
	then
		SendNUIMessage({
			type = "atm-visibility",
			visibility = false,
			interfaceType = type
		})
	elseif(subcommand == 'show')
	then
		SendNUIMessage({
			type = "atm-visibility",
			visibility = true,
			interfaceType = type
		})
	end
	
end, false)

RegisterNUICallback('focus', function(data, cb)
	local focus = data.focus or false

	SetNuiFocus(focus, focus)
	
	cb({})
end)

RegisterNUICallback('access/add', function(data, cb)
	local accessId = data.id

	if(accessId >= 0) then
		TriggerEvent("chat:addMessage", {
			args = { 'Attempting to add access with id ' .. accessId .. ' with user ' .. data.userId .. ' for account ' .. data.accountId .. ' of access level ' .. data.accessLevel }
		})

		cb({
			success = true
		})
	else
		print('ERROR: INVALID ACCESS ID')

		cb({
			success = false
		})
	end
end)

RegisterNUICallback('access/edit', function(data, cb)
	local accessId = data.id
	local accessLevel = data.level or 0

	if(accessId >= 0) then
		TriggerEvent("chat:addMessage", {
			args = { 'Attempting to edit access with id ' .. accessId .. ' to level ' .. accessLevel }
		})

		cb({
			success = true
		})
	else
		print('ERROR: INVALID ACCESS ID')

		cb({
			success = false
		})
	end
end)

RegisterNUICallback('access/remove', function(data, cb)
	local accessId = data.id

	if(accessId >= 0) then
		TriggerEvent("chat:addMessage", {
			args = { 'Attempting to remove access with id ' .. accessId }
		})

		cb({
			success = true
		})
	else
		print('ERROR: INVALID ACCESS ID')

		cb({
			success = false
		})
	end
end)

RegisterNUICallback('transaction/commit', function(data, cb)
	local type = data.type
	local amount = data.amount
	local destination = data.destination
	local origin = data.origin
	local initiator = data.initiator
	
	-- Do validation

	-- Process transaction
	if(type == 'DEPOSIT') then
		TriggerEvent("chat:addMessage", {
			args = { initiator .. ' is attempting to deposit ' .. amount .. ' into ' .. destination }
		})
	elseif(type == 'WITHDRAWAL') then
		TriggerEvent("chat:addMessage", {
			args = { initiator .. ' is attempting to withdraw ' .. amount .. ' from ' .. origin }
		})
	elseif(type == 'TRANSFER') then
		TriggerEvent("chat:addMessage", {
			args = { initiator .. ' is attempting to transfer ' .. amount .. ' from ' .. origin .. ' to ' .. destination }
		})
	else
		print('ERROR: INVALID TRANSACTION TYPE')
		cb({
			success = false
		})
		return
	end

	-- Return that it was a success
	cb({
		success = true
	})
end)

RegisterNUICallback('retrieve', function(data, cb)
	-- Retrieve user information
	local user = {
		id = 816,
		name = 'Akihiro Sakamoto',
		cash = 500
	}

	-- Retrieve transactions
	local transactions = {
		{
			id = 0,
			type = 'DEPOSIT',
			origin = -1,
			destination = 100,
			initiator = 816,
			time = '2016-05-25T09:08:34.123Z',
			amount = 100,
			note = 'Cash Deposit'
		},
		{
			id = 1,
			type = 'WITHDRAWAL',
			origin = 100,
			destination = -1,
			initiator = 816,
			time = '2016-05-25T09:08:34.123Z',
			amount = 100,
			note = 'Cash Withdrawal'
		},
		{
			id = 2,
			type = 'TRANSFER',
			origin = 100,
			destination = 200,
			initiator = 816,
			time = '2016-05-25T09:08:34.123Z',
			amount = 100,
			note = 'Test Transfer'
		},
	}

	-- Retrieve access information for the given user
	local access = {
		{
			id = 0,
			userId = 816,
			accountId = 123456,
			accessLevel = 1
		},
		{
			id = 1,
			userId = 816,
			accountId = 987654,
			accessLevel = 1
		}
	}

	-- Retrieve account information of related accounts
	local accounts = {
		{
			id = 123456,
			name = 'Personal',
			type = 'Personal',
			routing = 100,
			balance = 5000
		},
		{
			id = 987654,
			name = 'Pillbox',
			type = 'Business',
			routing = 200,
			balance = 10000
		}
	}

	cb({
		user = user,
		transactions = transactions,
		access = access,
		accounts = accounts
	})
end)